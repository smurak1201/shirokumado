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
        // タグ・カテゴリーを除外するファイルパス一覧
        $excludeFiles = [
            'tenpo_icon.jpg',
            'Instagram_Glyph_Black-scaled.png',
            'Instagram_Glyph_Gradient-scaled.png',
            'Instagram_Glyph_White-scaled.png',
            'shirokuma_dx.png',
            'tenpo_gaikan.jpg',
        ];

        // 除外ファイルの画像IDを取得
        $excludeIds = DB::table('images')
            ->whereIn('file_path', $excludeFiles)
            ->pluck('id')
            ->toArray();

        // 除外画像のcategory_idをNULLにし、image_tagを削除
        DB::table('images')->whereIn('id', $excludeIds)->update(['category_id' => null]);
        DB::table('image_tag')->whereIn('image_id', $excludeIds)->delete();

        // 除外画像を除いたcategory_id=1の画像を取得
        $images = DB::table('images')
            ->where('category_id', 1)
            ->whereNotIn('id', $excludeIds)
            ->get();

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
            if ($tagLimited && in_array($image->title, $limitedTitles, true)) {
                // 限定メニュー対象画像には限定メニュータグのみ付与
                DB::table('image_tag')->insert([
                    'image_id' => $image->id,
                    'tag_id' => $tagLimited->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                // それ以外は通常メニュータグのみ付与
                DB::table('image_tag')->insert([
                    'image_id' => $image->id,
                    'tag_id' => $tagNormal->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
