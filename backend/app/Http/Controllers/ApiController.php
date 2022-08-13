<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Model\Blog;
use App\Model\Category;
use App\Model\Page;
use App\Model\User;
use App\Model\Contact;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;

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

    public function adminBlogs(Request $request)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $posts = [];

        if ($user) {
            $posts = Blog::select('id', 'title', 'image', 'created_at')->orderBy('id', 'DESC')->get();
        }

        return $posts;
    }

    public function adminBlog(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $post = null;

        if ($user) {
            $post = Blog::select('id', 'title', 'description', 'image', 'is_featured', 'is_active', 'created_at')
                ->where('id', $id)->first();
        }

        return $post;
    }

    public function createBlog(Request $request)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $response = [];

        if ($user) {
            $title = $request->title;
            $description = $request->description;
            $is_featured = $request->is_featured;
            $is_active = $request->is_active;

            $filename = null;

            if ($request->hasFile('image')) {
                $file = $request->image->getClientOriginalName();
                $filename = preg_replace('/\s+/', '_', strtolower(pathinfo($file, PATHINFO_FILENAME)))
                    . time() . '.' . $request->image->getClientOriginalExtension();

                $request->image->move(public_path('/images'), $filename);
            }

            $blog = new Blog();

            $blog->title = $title;
            $blog->user_id = $user->id;
            $blog->category_id = 1;
            $blog->description = $description;
            $blog->image = $filename;
            $blog->is_featured = $is_featured;
            $blog->is_active = $is_active;

            if ($blog->save()) {
                $response['status'] = 'success';
                $response['message'] = 'Record inserted successfully';
                $response['uploadError'] = false;
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record insertion failed';
                $response['uploadError'] = false;
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
            $response['uploadError'] = false;
        }

        return $response;
    }

    public function updateBlog(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();

        if ($user) {
            $title = $request->title;
            $description = $request->description;
            $is_featured = $request->is_featured;
            $is_active = $request->is_active;

            $filename = null;

            if ($request->hasFile('image')) {
                $file = $request->image->getClientOriginalName();
                $filename = preg_replace('/\s+/', '_', strtolower(pathinfo($file, PATHINFO_FILENAME)))
                    . time() . '.' . $request->image->getClientOriginalExtension();

                $request->image->move(public_path('/images'), $filename);
            }

            $blog = Blog::find($id);

            $blog->title = $title;
            $blog->user_id = $user->id;
            $blog->category_id = 1;
            $blog->description = $description;
            $blog->is_featured = $is_featured;
            $blog->is_active = $is_active;

            if ($filename) {
                $blog->image = $filename;
            }

            if ($blog->save()) {
                $response['status'] = 'success';
                $response['message'] = 'Record updated successfully';
                $response['uploadError'] = false;
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record updation failed';
                $response['uploadError'] = false;
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
            $response['uploadError'] = false;
        }

        return $response;
    }

    public function deleteBlog(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();

        if ($user) {
            $blog = Blog::find($id);

            if ($blog->image) {
                File::delete(public_path() . parse_url($blog->image)['path']);
            }

            if ($blog->delete()) {
                $response['status'] = 'success';
                $response['message'] = 'Record deleted successfully';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record deletion failed';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
        }

        return $response;
    }

    public function adminCategories(Request $request)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $categories = [];

        if ($user) {
            $categories = Category::select('id', 'category_name', 'created_at')->orderBy('id', 'DESC')->get();
        }

        return $categories;
    }

    public function adminCategory(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $category = null;

        if ($user) {
            $category = Category::select('id', 'category_name', 'created_at')->where('id', $id)->first();
        }

        return $category;
    }

    public function createCategory(Request $request)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();
        $response = [];

        if ($user) {
            $category = new Category();

            $category->category_name = $request->name;

            if ($category->save()) {
                $response['status'] = 'success';
                $response['message'] = 'Record inserted successfully';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record insertion failed';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
        }

        return $response;
    }

    public function updateCategory(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();

        if ($user) {
            $category = Category::find($id);

            $category->category_name = $request->name;

            if ($category->save()) {
                $response['status'] = 'success';
                $response['message'] = 'Record updated successfully';
                $response['uploadError'] = false;
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record updation failed';
                $response['uploadError'] = false;
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
            $response['uploadError'] = false;
        }

        return $response;
    }

    public function deleteCategory(Request $request, $id)
    {
        $token = $request->header('Authorization');
        $user = User::where('token', $token)->first();

        if ($user) {
            $category = Category::find($id);

            if ($category->delete()) {
                $response['status'] = 'success';
                $response['message'] = 'Record deleted successfully';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Record deletion failed';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Unauthorize access. Please try with valid credential.';
        }

        return $response;
    }
}
