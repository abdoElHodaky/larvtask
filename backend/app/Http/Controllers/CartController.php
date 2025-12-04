<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Get the user's cart items
     */
    public function index(): JsonResponse
    {
        $cartItems = auth()->user()->cart()->get();
        
        $cartData = [
            'items' => $cartItems,
            'total' => $cartItems->sum('subtotal'),
            'items_count' => $cartItems->sum('quantity'),
        ];

        return response()->json([
            'success' => true,
            'data' => $cartData
        ]);
    }

    /**
     * Add item to cart
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
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
                $product = Product::find($request->product_id);
                $quantity = $request->quantity;
                $userId = auth()->id();

                // Check if product is available
                if (!$product->isAvailable()) {
                    return response()->json([
                        'success' => false,
                        'message' => "Product '{$product->name}' is not available"
                    ], 422);
                }

                // Check existing cart item
                $existingCartItem = CartItem::where('user_id', $userId)
                    ->where('product_id', $product->id)
                    ->first();

                if ($existingCartItem) {
                    $newQuantity = $existingCartItem->quantity + $quantity;
                    
                    // Check stock availability
                    if ($product->stock < $newQuantity) {
                        return response()->json([
                            'success' => false,
                            'message' => "Insufficient stock. Available: {$product->stock}, Requested: {$newQuantity}"
                        ], 422);
                    }

                    $existingCartItem->update(['quantity' => $newQuantity]);
                    $cartItem = $existingCartItem;
                } else {
                    // Check stock availability for new item
                    if ($product->stock < $quantity) {
                        return response()->json([
                            'success' => false,
                            'message' => "Insufficient stock. Available: {$product->stock}, Requested: {$quantity}"
                        ], 422);
                    }

                    $cartItem = CartItem::create([
                        'user_id' => $userId,
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                    ]);
                }

                $cartItem->load('product');

                return response()->json([
                    'success' => true,
                    'message' => 'Item added to cart successfully',
                    'data' => $cartItem
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add item to cart: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        // Ensure user can only update their own cart items
        if ($cartItem->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $quantity = $request->quantity;
            $product = $cartItem->product;

            // Check stock availability
            if ($product->stock < $quantity) {
                return response()->json([
                    'success' => false,
                    'message' => "Insufficient stock. Available: {$product->stock}, Requested: {$quantity}"
                ], 422);
            }

            $cartItem->update(['quantity' => $quantity]);
            $cartItem->load('product');

            return response()->json([
                'success' => true,
                'message' => 'Cart item updated successfully',
                'data' => $cartItem
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update cart item: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove item from cart
     */
    public function destroy(CartItem $cartItem): JsonResponse
    {
        // Ensure user can only delete their own cart items
        if ($cartItem->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $cartItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove item from cart: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear all cart items for the user
     */
    public function clear(): JsonResponse
    {
        try {
            $deletedCount = CartItem::where('user_id', auth()->id())->delete();

            return response()->json([
                'success' => true,
                'message' => "Cart cleared successfully. {$deletedCount} items removed."
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear cart: ' . $e->getMessage()
            ], 500);
        }
    }
}
