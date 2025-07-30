<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $table = 'images';
    protected $guarded = [];
    /**
     * タグとの多対多リレーション
     */
    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'image_tag', 'image_id', 'tag_id');
    }

    /**
     * カテゴリとのリレーション
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
