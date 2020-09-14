from flask_sqlalchemy import model,SQLAlchemy
from sqlalchemy.orm import contains_eager,load_only
from flask import Flask, url_for,redirect,render_template,request
from uuid import uuid1

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///address.db'

db = SQLAlchemy(app)

class Link(db.Model):
    short_link  = db.Column(db.VARCHAR, primary_key=True)
    main_link  = db.Column(db.Text)


class Address(db.Model):
    key  = db.Column(db.VARCHAR, primary_key=True)
    address  = db.Column(db.Text)




db.create_all()


@app.route('/shorten/<short>')
def store(short):

    short_link = str(uuid1())[:7]

    link = Link(short_link=short_link,main_link=short)
    db.session.add(link)
    db.session.commit()


    return url_for(
    endpoint="redirection",
    short=short_link,
    _external=True
    )


@app.route('/<short>')
def redirection(short):
    link = Link.query.get_or_404(short)

    return redirect("//"+link.main_link)


@app.route('/address',methods=["Get","Post"])
def address():

    results = []

    if request.method == "POST":
        search_term = request.form.get("search_term")
        results = (Address.query
        .options(load_only(Address.address))
        .filter(Address.address.contains(search_term))
        .limit(500)
        .all())

    return render_template("index.html",addresses=results)


    return render_template('index.html',addresses=results)

    return redirect("//"+link.main_link)


@app.errorhandler(404)
def page_not_found(e):
    # note that we set the 404 status explicitly
    url = url_for('store',short="some_url")
    return f"""Please create a url at {url}.
    Remove the http:// before inputing it at the url.
    example:  {url_for('store',short='www.google.com',_external=True)}""", 404


app.run()