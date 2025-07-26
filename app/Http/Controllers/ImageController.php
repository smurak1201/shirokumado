<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function show($id)
    {
        $image = Image::findOrFail($id);
        return view('images.show', compact('image'));
    }
}
