Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :hikes, only: [:index, :create, :update]
  resources :hikes do
    resources :comments, only: [:index, :create]
  end
  resources :users, only: [:show, :create]

  post '/login', to: "session#login"

end
