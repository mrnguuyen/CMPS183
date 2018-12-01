# Here go your api methods.

#Gets all bikes from the database
def get_bikes():
    results = []
    rows = db().select(db.bike.ALL)
    for row in rows:
        results.append(dict(
            bike_id = row.id,
            bike_brand = row.Brand,
            bike_name = row.Name,
            bike_desc = row.Description,
            bike_img_url = row.ImageURL
        ))
    return response.json(dict(bikes_list=results))

#Gets bike based on bike id
def get_bike():
    bike_id = int(request.vars.bike_id)
    # row = db().select(db.bike.id == bike_id)
    for row in db(db.bike.id == bike_id).select():
        result = dict(
            bike_id = row.id,
            bike_brand = row.Brand,
            bike_name = row.Name,
            bike_desc = row.Description,
            bike_img_url = row.ImageURL
        )
    return response.json(dict(bike=result))

@auth.requires_signature()
def add_post():
    user_email = auth.user.email
    post_id = db.post.insert(
        bike_id = int(request.vars.bike_id),
        post_title=request.vars.post_title,
        post_content=request.vars.post_content,
    )

    
    # We return the id of the new post, so we can insert it along all the others.
    return response.json(dict(post_id=post_id))

@auth.requires_signature()
def add_reply():
    user_email = auth.user.email
    reply_id = db.reply.insert(
        post_id = int(request.vars.post_id),
        reply_content = request.vars.reply_content,
        reply_author = user_email
    )
    result = dict(
        reply_id = reply_id,
        reply_author = user_email
    )
    return response.json(dict(result))

@auth.requires_signature()
def edit_post():
    post_id = int(request.vars.post_id)
    post_titlex = request.vars.post_title
    post_contentx = request.vars.post_content
    db(db.post.id == post_id).update(post_title = post_titlex)
    db(db.post.id == post_id).update(post_content = post_contentx)
    return "ok"

@auth.requires_signature()
def edit_reply():
    reply_id = int(request.vars.reply_id)
    reply_contentx = request.vars.reply_content
    db(db.reply.id == reply_id).update(reply_content = reply_contentx)
    return "ok"

def get_post_list():
    results = []
    if auth.user is None:
        # Not logged in.
        rows = db().select(db.post.ALL, orderby=~db.post.post_time)
        for row in rows:
            results.append(dict(
                id=row.id,
                post_title=row.post_title,
                post_content=row.post_content,
                post_author=row.post_author,
                bike_id=row.bike_id,
                thumb = None,
                is_author = None
            ))
    else:
        # Logged in.
        rows = db().select(db.post.ALL, db.thumb.ALL,
                            left=[
                                db.thumb.on((db.thumb.post_id == db.post.id) & (db.thumb.user_email == auth.user.email)),
                            ],
                            orderby=~db.post.post_time)
        for row in rows:
            results.append(dict(
                id=row.post.id,
                post_title=row.post.post_title,
                post_content=row.post.post_content,
                post_author=row.post.post_author,
                bike_id=row.post.bike_id,
                thumb = None if row.thumb.id is None else row.thumb.thumb_state,
                is_author = True if auth.user.email == row.post.post_author else False 
            ))
    # For homogeneity, we always return a dictionary.
    return response.json(dict(post_list=results))

def get_replies():
    results = []
    if auth.user is None:
    # Not logged in.
        rows = db().select(db.reply.ALL)
        for row in rows:
            results.append(dict(
                id=row.id,
                reply_author=row.reply_author,
                post_id=row.post_id,
                reply_content=row.reply_content,
                is_author = None
            ))
    else:
        rows = db().select(db.reply.ALL)
        for row in rows:
            results.append(dict(
                id=row.id,
                reply_author=row.reply_author,
                post_id=row.post_id,
                reply_content=row.reply_content,
                is_author = True if auth.user.email == row.reply_author else False 
            ))
    return response.json(dict(reply_list=results))

    
@auth.requires_signature()
def set_thumb():
    post_id = int(request.vars.post_id)
    thumb = request.vars.thumb_state
    db.thumb.update_or_insert(
        (db.thumb.post_id == post_id) & (db.thumb.user_email == auth.user.email),
        post_id = post_id,
        user_email = auth.user.email,
        thumb_state = thumb
    )
    return "ok" # Might be useful in debugging.

def get_thumbs():
    """Gets the list of people who liked a post."""
    results = []
    # We get directly the list of all the users who liked the post. 
    rows = db().select(db.thumb.ALL)
    for row in rows:
        results.append(dict(
            post_id = row.post_id,
            thumb_state = row.thumb_state
        ))
    # For homogeneity, we always return a dictionary.
    return response.json(dict(thumb_list=results))


