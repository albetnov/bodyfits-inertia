<?php

namespace App\Http\Controllers;

use App\Http\Requests\SendFeedbackRequest;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    public function index()
    {
        return Inertia::render('Authed/Feedback');
    }

    public function sendFeedback(SendFeedbackRequest $sendFeedbackRequest)
    {
        Feedback::create($sendFeedbackRequest);
        return to_route('feedback');
    }
}
