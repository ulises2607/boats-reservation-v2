Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  devise_for :users, path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    registration: 'signup'
  },
  controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

  namespace :api do
    namespace :v1 do
      get 'current_user', to: 'current_user#show'
      resources :users
      resources :boats
      resources :reservations
      
      # Admin routes
      get 'admin/dashboard', to: 'admin#dashboard'
      get 'admin/users', to: 'admin#users'
      put 'admin/users/:id', to: 'admin#update_user'
      delete 'admin/users/:id', to: 'admin#delete_user'
      get 'admin/boats', to: 'admin#boats'
      delete 'admin/boats/:id', to: 'admin#delete_boat'
    end
  end
  # Defines the root path route ("/")
  # root "posts#index"
end
 