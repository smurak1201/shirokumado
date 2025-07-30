<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    // 並び順更新API
    public function updateDisplayOrder(Request $request)
    {
        $orders = $request->input('orders');
        if (!is_array($orders)) {
            return response()->json(['error' => 'Invalid payload'], 400);
        }
        foreach ($orders as $order) {
            if (isset($order['id'], $order['display_order'])) {
                $updated = \App\Models\Image::where('id', $order['id'])
                    ->update(['display_order' => $order['display_order']]);
                \Log::info('Image update', [
                    'id' => $order['id'],
                    'display_order' => $order['display_order'],
                    'updated' => $updated
                ]);
            }
        }
        return response()->json(['status' => 'ok']);
    }
    public function show($id)
    {
        $image = Image::findOrFail($id);
        return view('images.show', compact('image'));
    }

    // API用: 画像一覧をJSONで返す
    public function index()
    {
        $images = \DB::table('images')
            ->join('image_tag', 'images.id', '=', 'image_tag.image_id')
            ->join('tags', 'image_tag.tag_id', '=', 'tags.id')
            ->leftJoin('categories', 'images.category_id', '=', 'categories.id')
            ->where('images.is_public', true)
            ->select('images.*', 'tags.name as tag_name', 'categories.name as category_name')
            ->orderBy('images.display_order')
            ->orderBy('images.id')
            ->get();
        return response()->json($images);
    }
    // 画像情報＋タグ編集API
    public function update(Request $request, $id)
    {
        $image = Image::findOrFail($id);

        // 画像情報の更新
        $image->fill($request->only([
            'title',
            'price_s',
            'price_l',
            'price_other',
            'caption',
            'category_id',
            'display_order',
            'is_public',
            'start_at',
            'end_at'
        ]));
        $image->save();

        // タグの更新（tags: [1,2,3] 形式で送信）
        if ($request->has('tags')) {
            $image->tags()->sync($request->input('tags'));
        }

        // 編集後の画像＋タグ情報を返す（tagsはidとnameの配列、category_nameも付与）
        $image->load(['tags', 'category']);
        return response()->json([
            'id' => $image->id,
            'title' => $image->title,
            'file_path' => $image->file_path,
            'alt_text' => $image->alt_text,
            'caption' => $image->caption,
            'category_id' => $image->category_id,
            'category_name' => optional($image->category)->name ?? '',
            'display_order' => $image->display_order,
            'is_public' => $image->is_public,
            'price_s' => $image->price_s,
            'price_l' => $image->price_l,
            'price_other' => $image->price_other,
            'start_at' => $image->start_at,
            'end_at' => $image->end_at,
            'tags' => $image->tags ? $image->tags->map(fn($t) => ['id' => $t->id, 'name' => $t->name])->values() : [],
            'created_at' => $image->created_at,
            'updated_at' => $image->updated_at,
        ]);
    }
}
