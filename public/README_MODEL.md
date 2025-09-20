# AI Stress Predictor Model Files

## Setup Instructions

To use the AI Stress Predictor feature, you need to place your trained TensorFlow.js model files in this directory:

### Required Files:
1. `model.json` - ✅ Already created (placeholder)
2. `model.weights.bin` - ❌ **You need to add this file**

### How to Get Your Model Files:

If you have a Python TensorFlow model, convert it to TensorFlow.js format:

```python
import tensorflowjs as tfjs

# Convert your trained model
tfjs.converters.save_keras_model(your_model, './web_model')
```

Then copy the generated files:
- Copy `model.json` to `/public/model.json` (already done)
- Copy `model.weights.bin` to `/public/model.weights.bin`

### Model Requirements:
- Input shape: [batch_size, 3] (stress, depression, anxiety scores 0-5)
- Output: Single value (stress prediction)
- The model should be trained on normalized inputs (divided by 5.0)

### Testing Without a Real Model:
The current placeholder will show an error. To test the UI without a trained model:
1. The page will load but show "Error loading model"
2. All UI components will work except the actual prediction
3. Replace with your real trained model files for full functionality

### Example Model Training Data Format:
```
Input: [stress_level, depression_score, anxiety_score] (0-5 scale)
Output: stress_prediction (0-1 scale, where 1 = less stressed)
```