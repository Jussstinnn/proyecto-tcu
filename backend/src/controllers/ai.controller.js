const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getPromptByStep(step, field, text, formData = {}) {
  const contexto = `
Contexto del formulario:
- Título del proyecto: ${formData.tituloProyecto || ""}
- Descripción del problema: ${formData.justificacion || ""}
- Objetivo general: ${formData.objetivoGeneral || ""}
- Beneficiarios: ${formData.beneficiarios || ""}
- Estrategia de solución: ${formData.estrategiaSolucion || ""}
`;

  if (step === 3) {
    return `
Sos un asistente académico para anteproyectos de TCU de la Universidad Fidélitas.

Tu tarea es ayudar al estudiante a redactar mejor el campo "${field}" sin inventar datos.
Debés:
- corregir redacción, claridad y formalidad
- mantener sentido académico
- evitar texto exagerado o ambiguo
- si es objetivo general, verificar que inicie en infinitivo
- si es título, hacerlo claro y específico
- responder únicamente en JSON válido

${contexto}

Texto actual:
${text || ""}

Respondé exactamente con este formato:
{
  "score": 0,
  "issues": [],
  "tips": [],
  "suggestion": ""
}
`;
  }

  if (step === 4) {
    return `
Sos un asistente académico para anteproyectos de TCU de la Universidad Fidélitas.

Estás revisando un objetivo específico.
Debés:
- verificar si inicia con verbo en infinitivo
- verificar claridad
- evitar redundancia
- mejorar redacción
- responder únicamente en JSON válido

${contexto}

Texto actual:
${text || ""}

Respondé exactamente con este formato:
{
  "score": 0,
  "issues": [],
  "tips": [],
  "suggestion": ""
}
`;
  }

  if (step === 5) {
    return `
Sos un asistente académico para anteproyectos de TCU de la Universidad Fidélitas.

Estás revisando una fila de cronograma.
Debés:
- validar claridad de actividad
- validar claridad de tarea
- revisar coherencia entre actividad y tarea
- sugerir mejor redacción
- responder únicamente en JSON válido

${contexto}

Campo a revisar: ${field}
Texto actual:
${text || ""}

Respondé exactamente con este formato:
{
  "score": 0,
  "issues": [],
  "tips": [],
  "suggestion": ""
}
`;
  }

  return `
Sos un asistente académico.
Mejorá el siguiente texto sin inventar datos y respondé en JSON válido.

Texto:
${text || ""}

Formato:
{
  "score": 0,
  "issues": [],
  "tips": [],
  "suggestion": ""
}
`;
}

async function redactarAyuda(req, res) {
  try {
    const { step, field, text, formData } = req.body;

    if (!step || !field) {
      return res.status(400).json({
        message: "step y field son requeridos",
      });
    }

    const prompt = getPromptByStep(step, field, text, formData);

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: prompt,
    });

    const rawText = response.output_text || "";

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = {
        score: 70,
        issues: ["No se pudo estructurar la respuesta en JSON."],
        tips: ["Intentá nuevamente."],
        suggestion: rawText,
      };
    }

    return res.json(parsed);
  } catch (err) {
    console.error("Error en IA:", err);
    return res.status(500).json({
      message: "Error consultando OpenAI",
      error: err.message,
    });
  }
}

module.exports = {
  redactarAyuda,
};
