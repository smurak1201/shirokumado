<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    // 画像新規追加API
    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|file|image|mimes:jpg,jpeg,png,gif,webp,bmp',
            'title' => 'required|string|max:255',
            'caption' => 'nullable|string',
            'category_id' => 'required|integer|exists:categories,id',
            'price_s' => 'nullable|numeric',
            'price_l' => 'nullable|numeric',
            'price_other' => 'nullable|numeric',
            'is_public' => 'required|in:0,1',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date',
            'tags' => 'array',
            'tags.*' => 'integer|exists:tags,id',
        ]);

        // 画像ファイル保存
        $file = $request->file('image');
        $uploadPath = env('IMAGE_UPLOAD_PATH', public_path('images'));
        $filename = uniqid('img_') . '.' . $file->getClientOriginalExtension();
        $file->move($uploadPath, $filename);

        // DB登録
        $image = new Image();
        $image->file_path = $filename;
        $image->title = $validated['title'];
        $image->caption = $validated['caption'] ?? null;
        $image->category_id = $validated['category_id'];
        $image->price_s = $validated['price_s'] ?? null;
        $image->price_l = $validated['price_l'] ?? null;
        $image->price_other = $validated['price_other'] ?? null;
        $image->is_public = $validated['is_public'];
        $image->start_at = $validated['start_at'] ?? null;
        $image->end_at = $validated['end_at'] ?? null;
        $image->save();

        // タグ紐付け
        if ($request->has('tags')) {
            $image->tags()->sync($validated['tags']);
        }

        // レスポンス
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
            'tags' => $image->tags ? $image->tags->pluck('id')->values() : [],
            'created_at' => $image->created_at,
            'updated_at' => $image->updated_at,
        ], 201);
    }
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
        // Eloquentで画像＋タグ＋カテゴリを取得（公開・非公開すべて）
        $images = Image::with(['tags', 'category'])
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();

        // tagsはID配列として返す
        $result = $images->map(function ($img) {
            return [
                'id' => $img->id,
                'title' => $img->title,
                'file_path' => $img->file_path,
                'alt_text' => $img->alt_text,
                'caption' => $img->caption,
                'category_id' => $img->category_id,
                'category_name' => optional($img->category)->name ?? '',
                'display_order' => $img->display_order,
                'is_public' => $img->is_public,
                'price_s' => $img->price_s,
                'price_l' => $img->price_l,
                'price_other' => $img->price_other,
                'start_at' => $img->start_at,
                'end_at' => $img->end_at,
                'tags' => $img->tags ? $img->tags->pluck('id')->values() : [],
                'created_at' => $img->created_at,
                'updated_at' => $img->updated_at,
            ];
        });
        return response()->json($result);
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
    // 画像削除API
    public function destroy($id)
    {
        $image = Image::findOrFail($id);
        // タグ紐付け解除
        if (method_exists($image, 'tags')) {
            $image->tags()->detach();
        }
        // 画像ファイル削除
        $uploadPath = env('IMAGE_UPLOAD_PATH', public_path('images'));
        $filePath = $uploadPath . DIRECTORY_SEPARATOR . $image->file_path;
        if (is_file($filePath)) {
            @unlink($filePath);
        }
        // DBレコード削除
        $image->delete();
        return response()->json(['status' => 'deleted'], 200);
    }
}
