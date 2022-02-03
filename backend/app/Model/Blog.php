<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    /**
     * Get the user record associated with the blog.
     */
    public function user()
    {
        return $this->hasOne('App\Model\User', 'id', 'user_id');
    }

    /**
     * Get the category record associated with the blog.
     */
    public function category()
    {
        return $this->hasOne('App\Model\Category', 'id', 'category_id');
    }

    /**
     * Get the image value with path.
     *
     * @param  string  $value
     * @return string
     */
    public function getImageAttribute($value)
    {
        return url('images/' . $value);
    }
}