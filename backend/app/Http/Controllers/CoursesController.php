<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Model\Course;

class CoursesController extends Controller
{
    /**
     * Get all courses
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    function index(Request $request)
    {
        $courses = Course::all();

        return response()->json($courses);
    }

    /**
     * Create new course
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    function store(Request $request)
    {
        $course = new Course;

        $course->title = $request->title;
        $course->description = $request->description;
        $course->percentComplete = $request->percentComplete;
        $course->favorite = $request->favorite;

        return $course->save();
    }

    /**
     * Update course
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  Interger $id
     * @return \Illuminate\Http\Response
     */
    function update(Request $request, $courseId)
    {
        $course = Course::find($courseId);

        $course->title = $request->title;
        $course->description = $request->description;
        $course->percentComplete = $request->percentComplete;
        $course->favorite = $request->favorite;

        return $course->save();
    }

    /**
     * Delete course
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  Interger $id
     * @return \Illuminate\Http\Response
     */
    function delete(Request $request, $courseId)
    {
        $course = Course::find($courseId);
        return $course->delete();
    }
}