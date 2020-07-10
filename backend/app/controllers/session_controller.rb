class SessionController < ApplicationController

    # def current_user
    #     if session[:id] 
    #         user = User.find(session[:id])
    #         session[:id] = user.id
    #         render json: user
    #     else
    #         render json: session[:id]
    #     end
    # end

    def login
        if user = User.find_by(email: params[:email])
            if user = user.authenticate(params[:password])
                render json: user
            end
        end
        
    end

end