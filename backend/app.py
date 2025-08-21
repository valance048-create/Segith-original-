from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return {"message": "Bienvenido a la Academia de Belleza Segith"}

@app.route("/subir", methods=["POST"])
def subir():
    archivo = request.files["archivo"]
    archivo.save(f"uploads/{archivo.filename}")
    return {"message": "Archivo subido correctamente"}

if __name__ == "__main__":
    app.run(debug=True)
