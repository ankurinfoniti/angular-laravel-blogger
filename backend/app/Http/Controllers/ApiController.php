<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Model\Blog;
use App\Model\Category;
use App\Model\Page;
use App\Model\User;

class ApiController extends Controller
{
    public function blogs()
    {
        $blogs = Blog::with('user:id,name')
            ->with('category:id,category_name')
            ->where('is_active', 1)
            ->get();

        return $blogs;
    }

    public function featuredBlogs()
    {
        $blogs = Blog::with('user:id,name')
            ->with('category:id,category_name')
            ->where('is_active', 1)
            ->where('is_featured', 1)
            ->get();

        return $blogs;
    }

    public function recentBlogs()
    {
        $blogs = Blog::with('user:id,name')
            ->with('category:id,category_name')
            ->where('is_active', 1)
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get();

        return $blogs;
    }

    public function categories()
    {
        return Category::select('id', 'category_name')->get();
    }

    public function blog($id)
    {
        $blog = Blog::with('user:id,name')
            ->with('category:id,category_name')
            ->where('id', $id)
            ->first();

        return $blog;
    }

    public function page($slug)
    {
        $page = Page::select('id', 'title', 'description')->where('slug', $slug)->get();

        return $page;
    }
}