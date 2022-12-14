<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Traits\SearchableModel;
use App\Http\Controllers\Admin\Traits\ToastTrait;
use App\Http\Controllers\Controller;
use App\Http\Requests\TrainersRequest;
use App\Models\Trainers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TrainerController extends Controller
{
    use ToastTrait, SearchableModel;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $model = Trainers::orderByDesc('id');

        $trainers = $model->paginate($request->per_page ?? 5);

        if ($request->search) {
            $trainers = $this->setSearchableModel($model)
                ->addSearch('name', $request->search)
                ->addSearch('nationality', $request->search)
                ->addSearch('job', $request->search)
                ->addSearch('contact', $request->search)
                ->search('admin.trainers.index');
        }

        if ($request->wantsJson()) {
            return $trainers;
        }

        return Inertia::render('Authed/Admin/Trainers/Trainers', [
            'data' => $trainers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('Authed/Admin/Trainers/Form');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\TrainersRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TrainersRequest $request)
    {
        $data = $request->validated();
        $photo = $request->photo;

        if ($photo && trim($photo) !== '') {
            $name = time().$photo->getClientOriginalName();
            Storage::putFileAs('images/trainers', $photo, $name);
            $data['photo'] = $name;
        }

        Trainers::create($data);

        return $this->created('admin.trainers.index', 'Trainer');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Trainers  $trainers
     * @return \Illuminate\Http\Response
     */
    public function show(Trainers $trainers)
    {
        return Inertia::render('Authed/Admin/Trainers/Detail', ['data' => $trainers]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Trainers  $trainers
     * @return \Illuminate\Http\Response
     */
    public function edit(Trainers $trainers)
    {
        return Inertia::render('Authed/Admin/Trainers/Form', ['trainer' => $trainers]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\TrainersRequest  $request
     * @param  \App\Models\Trainers  $trainers
     * @return \Illuminate\Http\Response
     */
    public function update(TrainersRequest $request, Trainers $trainers)
    {
        $data = $request->except(['password', 'password_confirmation']);

        $photo = $request->photo;

        unset($data['photo']);

        // handle kalau ada foto.
        if ($photo && trim($photo) !== '') {
            autoRemovePhoto($trainers->photo);
            $name = time().$photo->getClientOriginalName();
            Storage::putFileAs('images/trainers', $photo, $name);
            $data['photo'] = $name;
        }

        if ($request->password && trim($request->password) !== '') {
            $data['password'] = bcrypt($request->password);
        }

        $trainers->update($data);

        return $this->edited('admin.trainers.index', 'Trainer');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Trainers  $trainers
     * @return \Illuminate\Http\Response
     */
    public function destroy(Trainers $trainers)
    {
        if ($trainers->loadCount('courses')->courses_count > 0) {
            $this->cast('Delete courses first!', 'warning');

            return;
        }
        autoRemovePhoto($trainers->photo);

        $trainers->delete();
        $this->deleted('Trainer');
    }
}
