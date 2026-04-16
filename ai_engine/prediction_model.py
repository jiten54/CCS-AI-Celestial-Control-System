import sys
import json
import numpy as np

# Simple predictive model based on trend analysis
class StatePredictor:
    def __init__(self):
        self.history = {}

    def predict(self, node_id, telemetry):
        if node_id not in self.history:
            self.history[node_id] = []
        
        self.history[node_id].append(telemetry['load'])
        if len(self.history[node_id]) > 20:
            self.history[node_id].pop(0)

        if len(self.history[node_id]) > 5:
            # Linear trend
            x = np.arange(len(self.history[node_id]))
            y = np.array(self.history[node_id])
            slope, intercept = np.polyfit(x, y, 1)
            
            # Predict 5 steps ahead
            predicted_load = slope * (len(x) + 5) + intercept
            
            status = 'NORMAL'
            if predicted_load > 90:
                status = 'CRITICAL'
            elif predicted_load > 70:
                status = 'WARNING'
            
            return {
                'node_id': node_id,
                'status': status,
                'failure_probability': float(min(1.0, max(0.0, (predicted_load - 50) / 50))),
                'prediction_window': '5s'
            }
        
        return {
            'node_id': node_id,
            'status': 'NORMAL',
            'failure_probability': 0.0,
            'prediction_window': '5s'
        }

predictor = StatePredictor()

def main():
    for line in sys.stdin:
        try:
            data = json.loads(line)
            if data.get('type') == 'telemetry':
                node_id = data['node_id']
                prediction = predictor.predict(node_id, data['payload'])
                
                print(json.dumps({
                    'type': 'prediction_result',
                    'node_id': node_id,
                    'prediction': prediction
                }))
                sys.stdout.flush()
        except Exception as e:
            # print(json.dumps({'type': 'error', 'message': str(e)}), file=sys.stderr)
            pass

if __name__ == "__main__":
    main()
