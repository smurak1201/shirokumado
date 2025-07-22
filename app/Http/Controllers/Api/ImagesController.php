<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ImagesController extends Controller
{
    /**
     * 画像一覧取得API
     * クエリパラメータ: category_id, tag_id, is_public, order_by
     */
    public function index(Request $request)
    {
        $query = DB::table('images')
            ->select('images.*')
            ->when($request->filled('category_id'), function ($q) use ($request) {
                $q->where('images.category_id', $request->category_id);
            })
            ->when($request->filled('is_public'), function ($q) use ($request) {
                $q->where('images.is_public', $request->is_public);
            });

        // タグ検索
        if ($request->filled('tag_id')) {
            $query->join('image_tag', 'images.id', '=', 'image_tag.image_id')
                ->where('image_tag.tag_id', $request->tag_id);
        }

        // 表示順
        if ($request->filled('order_by')) {
            $query->orderBy($request->order_by);
        } else {
            $query->orderBy('images.display_order');
        }

        $images = $query->get();
        return response()->json($images);
    }
}
