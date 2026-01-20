from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import math

app = FastAPI(
    title="Calculadora API",
    description="API para operaciones de calculadora clásica",
    version="1.0.0"
)

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos
class CalculationRequest(BaseModel):
    num1: float
    num2: Optional[float] = None
    operation: str

class CalculationResponse(BaseModel):
    result: float
    operation: str
    expression: str

class HistoryItem(BaseModel):
    expression: str
    result: float

# Almacenamiento en memoria del historial
calculation_history: List[HistoryItem] = []

# Rutas básicas
@app.get("/")
async def root():
    return {
        "message": "Calculadora API",
        "version": "1.0.0",
        "endpoints": [
            "/calculate - POST: Realizar cálculos",
            "/history - GET: Ver historial",
            "/history - DELETE: Limpiar historial",
            "/operations - GET: Ver operaciones disponibles"
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "calculator"}

@app.post("/calculate", response_model=CalculationResponse)
async def calculate(request: CalculationRequest):
    """
    Realiza operaciones matemáticas básicas y avanzadas
    """
    try:
        num1 = request.num1
        num2 = request.num2
        operation = request.operation.lower()
        
        result = None
        expression = ""
        
        # Operaciones binarias
        if operation in ['+', 'add', 'suma']:
            if num2 is None:
                raise HTTPException(status_code=400, detail="Se requiere num2 para suma")
            result = num1 + num2
            expression = f"{num1} + {num2}"
            
        elif operation in ['-', 'subtract', 'resta']:
            if num2 is None:
                raise HTTPException(status_code=400, detail="Se requiere num2 para resta")
            result = num1 - num2
            expression = f"{num1} - {num2}"
            
        elif operation in ['*', 'x', '×', 'multiply', 'multiplicacion']:
            if num2 is None:
                raise HTTPException(status_code=400, detail="Se requiere num2 para multiplicación")
            result = num1 * num2
            expression = f"{num1} × {num2}"
            
        elif operation in ['/', '÷', 'divide', 'division']:
            if num2 is None:
                raise HTTPException(status_code=400, detail="Se requiere num2 para división")
            if num2 == 0:
                raise HTTPException(status_code=400, detail="División por cero no permitida")
            result = num1 / num2
            expression = f"{num1} ÷ {num2}"
            
        elif operation in ['%', 'mod', 'modulo']:
            if num2 is None:
                raise HTTPException(status_code=400, detail="Se requiere num2 para módulo")
            if num2 == 0:
                raise HTTPException(status_code=400, detail="Módulo por cero no permitido")
            result = num1 % num2
            expression = f"{num1} % {num2}"
            
        elif operation in ['^', '**', 'pow', 'power', 'potencia']:
            if num2 is None:
                raise HTTPException(status_code=400, detail="Se requiere num2 para potencia")
            result = math.pow(num1, num2)
            expression = f"{num1} ^ {num2}"
            
        # Operaciones unarias
        elif operation in ['sqrt', 'raiz', 'square_root']:
            if num1 < 0:
                raise HTTPException(status_code=400, detail="No se puede calcular raíz cuadrada de número negativo")
            result = math.sqrt(num1)
            expression = f"√{num1}"
            
        elif operation in ['square', 'cuadrado']:
            result = num1 ** 2
            expression = f"{num1}²"
            
        elif operation in ['abs', 'absolute', 'valor_absoluto']:
            result = abs(num1)
            expression = f"|{num1}|"
            
        elif operation in ['negate', 'negativo', 'toggle_sign']:
            result = -num1
            expression = f"-({num1})"
            
        elif operation in ['percent', 'porcentaje']:
            result = num1 / 100
            expression = f"{num1}%"
            
        elif operation in ['inverse', 'inverso']:
            if num1 == 0:
                raise HTTPException(status_code=400, detail="No se puede calcular inverso de cero")
            result = 1 / num1
            expression = f"1/{num1}"
            
        else:
            raise HTTPException(
                status_code=400, 
                detail=f"Operación '{operation}' no reconocida"
            )
        
        # Redondear el resultado a 10 decimales para evitar errores de punto flotante
        result = round(result, 10)
        
        # Agregar al historial
        history_item = HistoryItem(
            expression=f"{expression} = {result}",
            result=result
        )
        calculation_history.append(history_item)
        
        # Limitar historial a 100 items
        if len(calculation_history) > 100:
            calculation_history.pop(0)
        
        return CalculationResponse(
            result=result,
            operation=operation,
            expression=f"{expression} = {result}"
        )
        
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Error de valor: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el cálculo: {str(e)}")

@app.get("/history")
async def get_history():
    """
    Obtiene el historial de cálculos
    """
    return {
        "count": len(calculation_history),
        "history": list(reversed(calculation_history[-50:]))  # Últimos 50
    }

@app.delete("/history")
async def clear_history():
    """
    Limpia el historial de cálculos
    """
    calculation_history.clear()
    return {"message": "Historial limpiado exitosamente", "count": 0}

@app.get("/operations")
async def get_operations():
    """
    Lista todas las operaciones disponibles
    """
    return {
        "operations": {
            "binary": {
                "addition": ["+", "add", "suma"],
                "subtraction": ["-", "subtract", "resta"],
                "multiplication": ["*", "x", "×", "multiply", "multiplicacion"],
                "division": ["/", "÷", "divide", "division"],
                "modulo": ["%", "mod", "modulo"],
                "power": ["^", "**", "pow", "power", "potencia"]
            },
            "unary": {
                "square_root": ["sqrt", "raiz", "square_root"],
                "square": ["square", "cuadrado"],
                "absolute": ["abs", "absolute", "valor_absoluto"],
                "negate": ["negate", "negativo", "toggle_sign"],
                "percent": ["percent", "porcentaje"],
                "inverse": ["inverse", "inverso"]
            }
        }
    }

# Importar rutas adicionales si existen
try:
    from app.routes import api
    app.include_router(api.router)
except ImportError:
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)