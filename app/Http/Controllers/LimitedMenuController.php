<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Image;
use Illuminate\Support\Facades\DB;

class LimitedMenuController extends Controller
{
    public function index()
    {
        // "限定メニュー"タグが付与された画像のみ取得
        $images = DB::table('images')
            ->join('image_tag', 'images.id', '=', 'image_tag.image_id')
            ->join('tags', 'image_tag.tag_id', '=', 'tags.id')
            ->where('tags.name', '限定メニュー')
            ->where('images.is_public', true)
            ->select('images.*')
            ->orderBy('images.display_order')
            ->get();

        return view('home', compact('images'));
    }
}
