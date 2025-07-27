import requests

url = "http://127.0.0.1:8000/upload-report/"
files = {
    "file": open("uploads/demo.pdf", "rb")
}
data = {
    "report_type": "Blood Test",
    "report_date": "2025-07-27"
}

response = requests.post(url, files=files, data=data)
print(response.status_code)
print(response.json())

