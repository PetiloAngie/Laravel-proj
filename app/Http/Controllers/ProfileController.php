<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    public function index(): JsonResponse
    {
        $profiles = Profile::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'profiles' => $profiles
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'age' => 'required|integer|min:1|max:150'
        ]);

        Profile::create($validated);

        return response()->json([
            'message' => 'Profile submitted successfully!'
        ], 201);
    }
}
