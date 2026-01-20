from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import math

router = APIRouter(prefix="/api", tags=["API Routes"])

# Modelos adicionales
class BatchCalculationRequest(BaseModel):
    operations: List[dict]

class StatisticsRequest(BaseModel):
    numbers: List[float]

class StatisticsResponse(BaseModel):
    count: int
    sum: float
    mean: float
    median: float
    min_value: float
    max_value: float
    range: float
    variance: Optional[float] = None
    std_dev: Optional[float] = None

@router.get("/status")
async def api_status():
    """
    Estado de la API
    """
    return {
        "status": "active",
        "api_version": "1.0.0",
        "features": [
            "Operaciones básicas",
            "Operaciones avanzadas",
            "Cálculos por lotes",
            "Estadísticas",
            "Conversiones"
        ]
    }

@router.post("/batch-calculate")
async def batch_calculate(request: BatchCalculationRequest):
    """
    Realiza múltiples cálculos en una sola petición
    """
    results = []
    
    for idx, operation in enumerate(request.operations):
        try:
            num1 = operation.get('num1')
            num2 = operation.get('num2')
            op = operation.get('operation')
            
            if num1 is None or op is None:
                results.append({
                    "index": idx,
                    "success": False,
                    "error": "Faltan parámetros requeridos"
                })
                continue
            
            # Lógica de cálculo similar a la principal
            result = None
            
            if op == '+':
                result = num1 + (num2 or 0)
            elif op == '-':
                result = num1 - (num2 or 0)
            elif op in ['*', '×']:
                result = num1 * (num2 or 1)
            elif op in ['/', '÷']:
                if num2 == 0:
                    raise ValueError("División por cero")
                result = num1 / num2
            elif op == 'sqrt':
                result = math.sqrt(num1)
            elif op == 'square':
                result = num1 ** 2
            else:
                raise ValueError(f"Operación no reconocida: {op}")
            
            results.append({
                "index": idx,
                "success": True,
                "result": round(result, 10),
                "expression": f"{num1} {op} {num2 if num2 else ''}"
            })
            
        except Exception as e:
            results.append({
                "index": idx,
                "success": False,
                "error": str(e)
            })
    
    return {
        "total": len(request.operations),
        "successful": sum(1 for r in results if r.get('success')),
        "failed": sum(1 for r in results if not r.get('success')),
        "results": results
    }

@router.post("/statistics", response_model=StatisticsResponse)
async def calculate_statistics(request: StatisticsRequest):
    """
    Calcula estadísticas sobre un conjunto de números
    """
    if not request.numbers:
        raise HTTPException(status_code=400, detail="Se requiere al menos un número")
    
    numbers = sorted(request.numbers)
    n = len(numbers)
    
    # Cálculos básicos
    total_sum = sum(numbers)
    mean = total_sum / n
    min_value = min(numbers)
    max_value = max(numbers)
    value_range = max_value - min_value
    
    # Mediana
    if n % 2 == 0:
        median = (numbers[n//2 - 1] + numbers[n//2]) / 2
    else:
        median = numbers[n//2]
    
    # Varianza y desviación estándar
    variance = None
    std_dev = None
    
    if n > 1:
        variance = sum((x - mean) ** 2 for x in numbers) / n
        std_dev = math.sqrt(variance)
    
    return StatisticsResponse(
        count=n,
        sum=round(total_sum, 10),
        mean=round(mean, 10),
        median=round(median, 10),
        min_value=round(min_value, 10),
        max_value=round(max_value, 10),
        range=round(value_range, 10),
        variance=round(variance, 10) if variance is not None else None,
        std_dev=round(std_dev, 10) if std_dev is not None else None
    )

@router.get("/constants")
async def get_constants():
    """
    Retorna constantes matemáticas útiles
    """
    return {
        "pi": math.pi,
        "e": math.e,
        "tau": math.tau,
        "inf": "infinity",
        "golden_ratio": (1 + math.sqrt(5)) / 2
    }

@router.post("/convert/temperature")
async def convert_temperature(value: float, from_unit: str, to_unit: str):
    """
    Convierte entre unidades de temperatura
    """
    from_unit = from_unit.lower()
    to_unit = to_unit.lower()
    
    # Convertir a Celsius primero
    if from_unit == 'celsius' or from_unit == 'c':
        celsius = value
    elif from_unit == 'fahrenheit' or from_unit == 'f':
        celsius = (value - 32) * 5/9
    elif from_unit == 'kelvin' or from_unit == 'k':
        celsius = value - 273.15
    else:
        raise HTTPException(status_code=400, detail="Unidad de origen no reconocida")
    
    # Convertir de Celsius a la unidad destino
    if to_unit == 'celsius' or to_unit == 'c':
        result = celsius
    elif to_unit == 'fahrenheit' or to_unit == 'f':
        result = celsius * 9/5 + 32
    elif to_unit == 'kelvin' or to_unit == 'k':
        result = celsius + 273.15
    else:
        raise HTTPException(status_code=400, detail="Unidad de destino no reconocida")
    
    return {
        "original_value": value,
        "original_unit": from_unit,
        "converted_value": round(result, 2),
        "converted_unit": to_unit
    }

@router.post("/scientific/factorial")
async def calculate_factorial(n: int):
    """
    Calcula el factorial de un número
    """
    if n < 0:
        raise HTTPException(status_code=400, detail="El factorial no está definido para números negativos")
    if n > 170:
        raise HTTPException(status_code=400, detail="Número demasiado grande para calcular factorial")
    
    result = math.factorial(n)
    
    return {
        "number": n,
        "factorial": result,
        "expression": f"{n}!"
    }

@router.post("/scientific/trigonometry")
async def trigonometry(value: float, function: str, angle_unit: str = "radians"):
    """
    Funciones trigonométricas
    """
    angle_unit = angle_unit.lower()
    
    # Convertir a radianes si es necesario
    if angle_unit == "degrees" or angle_unit == "deg":
        radians = math.radians(value)
    else:
        radians = value
    
    function = function.lower()
    
    try:
        if function == 'sin':
            result = math.sin(radians)
        elif function == 'cos':
            result = math.cos(radians)
        elif function == 'tan':
            result = math.tan(radians)
        elif function == 'asin':
            result = math.asin(radians)
        elif function == 'acos':
            result = math.acos(radians)
        elif function == 'atan':
            result = math.atan(radians)
        else:
            raise HTTPException(status_code=400, detail="Función trigonométrica no reconocida")
        
        return {
            "value": value,
            "unit": angle_unit,
            "function": function,
            "result": round(result, 10)
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Error en cálculo: {str(e)}")

@router.post("/scientific/logarithm")
async def logarithm(value: float, base: Optional[float] = None):
    """
    Calcula logaritmos (natural, base 10, o base personalizada)
    """
    if value <= 0:
        raise HTTPException(status_code=400, detail="El logaritmo solo está definido para números positivos")
    
    if base is None:
        # Logaritmo natural
        result = math.log(value)
        base_str = "e"
    elif base == 10:
        result = math.log10(value)
        base_str = "10"
    elif base == 2:
        result = math.log2(value)
        base_str = "2"
    else:
        if base <= 0 or base == 1:
            raise HTTPException(status_code=400, detail="La base debe ser positiva y diferente de 1")
        result = math.log(value, base)
        base_str = str(base)
    
    return {
        "value": value,
        "base": base_str,
        "result": round(result, 10),
        "expression": f"log_{base_str}({value})"
    }

@router.get("/memory")
async def memory_operations():
    """
    Información sobre operaciones de memoria disponibles
    """
    return {
        "message": "Las operaciones de memoria se manejan en el frontend",
        "operations": [
            "M+ (Sumar al almacenamiento)",
            "M- (Restar del almacenamiento)",
            "MR (Recuperar de memoria)",
            "MC (Limpiar memoria)"
        ]
    }