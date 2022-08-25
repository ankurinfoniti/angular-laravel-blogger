<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class BlogVote extends Model
{
    protected $fillable = ['blog_id', 'like', 'dislike', 'created_at', 'updated_at'];
}
