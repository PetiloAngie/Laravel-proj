<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>Submit Profile</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    
    <style>
        body {
            font-family: 'Nunito', sans-serif;
            background-color: #f8f9fa;
        }
    </style>
</head>
<body>
    <div class="container mt-5">
        <div class="row">
            <!-- Profile Form -->
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h4>Submit Profile</h4>
                    </div>
                    <div class="card-body">
                        <form id="profile-form">
                            <div class="mb-3">
                                <label for="first_name" class="form-label">First Name</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="first_name"
                                    name="first_name"
                                    required
                                />
                            </div>

                            <div class="mb-3">
                                <label for="last_name" class="form-label">Last Name</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="last_name"
                                    name="last_name"
                                    required
                                />
                            </div>

                            <div class="mb-3">
                                <label for="age" class="form-label">Age</label>
                                <input
                                    type="number"
                                    class="form-control"
                                    id="age"
                                    name="age"
                                    min="1"
                                    max="150"
                                    required
                                />
                            </div>

                            <button type="submit" class="btn btn-primary">
                                Submit Profile
                            </button>
                        </form>

                        <div id="message" class="mt-3"></div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    
    <script src="{{ asset('js/submitform-simple.js') }}"></script>
</body>
</html>
