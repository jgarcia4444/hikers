class UsersController < ApplicationController
    
    def create
        new_user = User.create(user_params)
        session[:id] = new_user.id
        render json: new_user
    end

    def show 
        user = User.find(params[:id])
        render json: user
    end

    private 
        def user_params
            params.permit(:first_name, :last_name, :email, :password)
        end
end