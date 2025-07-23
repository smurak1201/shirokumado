<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImageTagTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // image_id 1～5のcategory_idをNULLにし、image_tagを削除
        DB::table('images')->whereIn('id', [1, 2, 3, 4, 5])->update(['category_id' => null]);
        DB::table('image_tag')->whereIn('image_id', [1, 2, 3, 4, 5])->delete();
        // imagesテーブルのcategory_id=1の画像を取得
        $images = DB::table('images')->where('category_id', 1)->get();
        // tagsテーブルの「通常メニュー」と「限定メニュー」のidを取得
        $tagNormal = DB::table('tags')->where('name', '通常メニュー')->first();
        $tagLimited = DB::table('tags')->where('name', '限定メニュー')->first();
        if (!$tagNormal) return;

        // 限定メニュー対象画像タイトル
        $limitedTitles = [
            '香がらしのホットなチャイかき氷',
            'フルーツトマトミルク',
            '抹茶木綿マスカル',
            '波のり超チョコミント氷',
        ];

        foreach ($images as $image) {
            // 通常メニュータグ
            DB::table('image_tag')->insert([
                'image_id' => $image->id,
                'tag_id' => $tagNormal->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 限定メニュータグ（タイトル一致の場合のみ）
            if ($tagLimited && in_array($image->title, $limitedTitles, true)) {
                DB::table('image_tag')->insert([
                    'image_id' => $image->id,
                    'tag_id' => $tagLimited->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
