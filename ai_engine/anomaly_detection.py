import sys
import json
import numpy as np
from sklearn.ensemble import IsolationForest

# Simple anomaly detector using Isolation Forest
class AnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.data_buffer = []
        self.is_trained = False

    def process_telemetry(self, data):
        # Extract features: load, latency, error_rate, throughput
        features = [data['load'], data['latency'], data['error_rate'], data['throughput']]
        self.data_buffer.append(features)
        
        # Keep buffer size manageable
        if len(self.data_buffer) > 500:
            self.data_buffer.pop(0)

        if len(self.data_buffer) > 50:
            if not self.is_trained or len(self.data_buffer) % 100 == 0:
                self.model.fit(self.data_buffer)
                self.is_trained = True
            
            prediction = self.model.predict([features])
            is_anomaly = prediction[0] == -1
            return is_anomaly
        
        return False

detector = AnomalyDetector()

def main():
    for line in sys.stdin:
        try:
            data = json.loads(line)
            if data.get('type') == 'telemetry':
                node_id = data['node_id']
                is_anomaly = detector.process_telemetry(data['payload'])
                
                print(json.dumps({
                    'type': 'anomaly_result',
                    'node_id': node_id,
                    'is_anomaly': bool(is_anomaly)
                }))
                sys.stdout.flush()
        except Exception as e:
            # print(json.dumps({'type': 'error', 'message': str(e)}), file=sys.stderr)
            pass

if __name__ == "__main__":
    main()
