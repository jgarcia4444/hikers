class CommentsController < ApplicationController

    def index
        hike = Hike.find(params[:hike_id])
        comments = hike.comments
        render json: comments
    end

    def create
        comment = Comment.create(comment_params)
    end

    def destroy
        comment_for_deletion = Comment.find(params[:id])
        comment_for_deletion.destroy
    end

    private
        def comment_params
            params.require(:comment).permit(:user_id, :content, :hike_id)
        end

end