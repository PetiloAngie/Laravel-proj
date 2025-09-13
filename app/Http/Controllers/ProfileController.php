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
    
    public function update(Request $request, Profile $profile): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'age' => 'required|integer|min:1|max:150'
        ]);

        $profile->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully!',
            'profile' => $profile
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Profile  $profile
     * @return \Illuminate\Http\Response
     */
    public function destroy(Profile $profile): JsonResponse
    {
        $profile->delete();

        return response()->json([
            'message' => 'Profile deleted successfully!'
        ]);
    }
}