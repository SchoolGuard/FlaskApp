# A very simple Flask Hello World app for you to get started with...

from flask import Flask, render_template, current_app, request
import json

app = Flask(__name__, static_url_path='')


@app.route('/')
def home():
    return render_template("home.html")

@app.route('/viewreports', methods=["GET"])
def get_reports():
    '''
    This method returns the reports put online

    returns json of all incidents
    '''
    return json.load(open("./reports.json"))

@app.route('/makereport', methods=["POST"])
def make_report():
    '''
    method posts to a file 
    method posts

    BUILDING
    LOCATION
    MESSAGE

    '''
    report = {
        'building': request.form['building'],
        'location': request.form['location'],
        'message': request.form['message']
    }
    #make new form

    with open('./reports.json', 'r+') as data_file:
        data = json.load(data_file)
        data.update(report)
        #reads data and adds more data

        json.dump(data,data_file)
        #writes data to file

    return True

if __name__ == '__main__':
    app.run(debug=True)
