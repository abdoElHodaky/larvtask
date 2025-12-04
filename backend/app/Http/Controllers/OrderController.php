<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Display a listing of orders for the authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['orderItems.product'])
            ->where('user_id', auth()->id());

        // Filter by status
        if ($request->has('status')) {
            $query->byStatus($request->get('status'));
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $orders = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ]
        ]);
    }

    /**
     * Store a newly created order from cart
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'address' => 'required|string|max:500',
            'phone' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            return DB::transaction(function () use ($request) {
                $items = $request->get('items');
                $total = 0;
                $orderItems = [];

                // Validate stock and calculate total
                foreach ($items as $item) {
                    $product = Product::find($item['product_id']);
                    
                    if (!$product->isAvailable()) {
                        return response()->json([
                            'success' => false,
                            'message' => "Product '{$product->name}' is not available"
                        ], 422);
                    }

                    if ($product->stock < $item['quantity']) {
                        return response()->json([
                            'success' => false,
                            'message' => "Insufficient stock for product '{$product->name}'. Available: {$product->stock}"
                        ], 422);
                    }

                    $subtotal = $product->price * $item['quantity'];
                    $total += $subtotal;

                    $orderItems[] = [
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price, // Store current price
                    ];
                }

                // Create order
                $order = Order::create([
                    'user_id' => auth()->id(),
                    'order_number' => Order::generateOrderNumber(),
                    'total' => $total,
                    'address' => $request->get('address'),
                    'phone' => $request->get('phone'),
                    'status' => 'pending',
                ]);

                // Create order items and update stock
                foreach ($orderItems as $orderItem) {
                    $order->orderItems()->create($orderItem);
                    
                    // Decrease product stock
                    $product = Product::find($orderItem['product_id']);
                    $product->decrement('stock', $orderItem['quantity']);
                }

                // Load relationships for response
                $order->load(['orderItems.product', 'user']);

                return response()->json([
                    'success' => true,
                    'message' => 'Order created successfully',
                    'data' => [
                        'order_number' => $order->order_number,
                        'total' => $order->total,
                        'items_count' => $order->orderItems->count(),
                        'order' => $order,
                    ]
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified order
     */
    public function show(Order $order): JsonResponse
    {
        // Ensure user can only view their own orders
        if ($order->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $order->load(['orderItems.product', 'user']);

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }
}
