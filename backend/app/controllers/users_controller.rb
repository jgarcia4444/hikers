class UsersController < ApplicationController
    
    def create
        new_user = User.create(user_params)
        render json: new_user
    end

    def show
        if params[:id] && params[:hike_id]
            user_that_liked = User.find(params[:id])
            hike_that_was_liked = Hike.find(params[:hike_id])
            
            liked_hikes = LikedHike.all

            already_liked = liked_hikes.any? do |liked_hike|
                liked_hike.hike == hike_that_was_liked && liked_hike.user == user_that_liked
            end
            if already_liked
                render json: {likable: false}
            else
                render json: {likable: true}
            end
        else
            user = User.find(params[:id])
            render json: user
        end
        
    end

    private 
        def user_params
            params.permit(:first_name, :last_name, :email, :password)
        end
end