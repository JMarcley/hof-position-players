from flask import Flask
from flask import render_template

app = Flask(__name__)

# @app.route("/hello")
# def hello():
#     return "Hello World!"
#
# @app.route("/one")
# def one():
#     return render_template("one.html")
#
# @app.route("/two")
# def two():
#     return render_template("sample_two.html")

@app.route("/")
def three():
    return render_template("sample_three.html")
