<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Model\Blog;
use App\Model\Category;
use App\Model\Page;
use App\Model\User;
use App\Model\Contact;
use Illuminate\Support\Facades\Hash;

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
        $page = Page::select('id', 'title', 'description')->where('slug', $slug)->first();

        return $page;
    }

    public function contact(Request $request)
    {
        $contactData = array(
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'message' => $request->message,
            'created_at' => date('Y-m-d H:i:s', time())
        );

        $response = Contact::insert($contactData);

        return ['id' => $response];
    }

    public function login(Request $request)
    {
        $username = $request->username;
        $password = $request->password;

        $user = User::where('username', $username)->first();

        if ($user && Hash::check($password, $user->password)) {
            $response = array(
                'user_id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'token' => $user->token
            );
        } else {
            $response = [];
        }

        return $response;
    }
}
