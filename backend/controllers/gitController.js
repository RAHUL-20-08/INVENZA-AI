export const getGitCode = (req, res) => {
  const { repo } = req.query;

  if (!repo) {
    return res.status(400).json({ success: false, message: 'Repository query is required.' });
  }

  // Repository to source code mapping (pointing to REAL repositories)
  const repositories = {
    'WeiPhil/LightFieldImaging': {
      filename: 'renderer.cpp',
      language: 'cpp',
      code: `#include <iostream>
#include <vector>

// Stanford Light Field Array Renderer
// Resolves focal matrix shifts after exposure
void renderLightField(float focalLength) {
    std::cout << "Loading 4D Light Field sub-lens array grid..." << std::endl;
    int arraySize = 16;
    
    for (int u = 0; u < arraySize; ++u) {
        for (int v = 0; v < arraySize; ++v) {
            // Compute coordinate micro-shifts
            float shift_x = u * focalLength * 0.0125f;
            float shift_y = v * focalLength * 0.0125f;
            
            // Volumetric alignment
            std::cout << "Rendering focal vector slice: (" 
                      << shift_x << "mm, " << shift_y << "mm)" << std::endl;
        }
    }
    std::cout << "Volumetric matrix aggregation complete." << std::endl;
}

int main() {
    // Re-focus slice at 4.5mm focal offset
    renderLightField(4.5f);
    return 0;
}`
    },
    'vroland/epdiy': {
      filename: 'driver.c',
      language: 'c',
      code: `#include <stdint.h>
#define DISPLAY_REG_ADDR 0x3F80

// E-Ink charge potential clearing wave controller
// Suppresses monochrome ghosting on static panels
void sendClearWaveform(uint8_t targetVoltage) {
    // Mount voltage output limits
    if (targetVoltage > 15) targetVoltage = 15;
    setDacVoltage(targetVoltage);
    delayMs(20);
    
    // Ghosting clearing cycles
    for (int cycle = 0; cycle < 3; cycle++) {
        // Dynamic alternating electrical potentials
        writeGrayscaleRegister(DISPLAY_REG_ADDR, 0x55); 
        delayMs(12);
        writeGrayscaleRegister(DISPLAY_REG_ADDR, 0xAA);
        delayMs(12);
    }
    
    // Release refresh locks
    writeGrayscaleRegister(DISPLAY_REG_ADDR, 0x00);
}`
    },
    'jaredsburrows/open-quartz': {
      filename: 'waveguide.py',
      language: 'python',
      code: `import numpy as np

def calculate_reflection_grating(prism_angle, refractive_index=1.82):
    """
    Calculates Surface Relief Grating (SRG) dispersion losses.
    Models outdoor contrast boundaries under sunlight.
    """
    print("Initializing waveguide light path tracing...")
    
    # Calculate angular vector loss
    angle_rad = np.radians(prism_angle)
    dispersion_loss = np.sin(angle_rad) / refractive_index
    refraction_efficiency = 1.0 - dispersion_loss
    
    print(f"Calculated Dispersion Loss: {dispersion_loss:.4f}")
    print(f"Waveguide Refraction Efficiency: {refraction_efficiency:.2%}")
    return refraction_efficiency

if __name__ == '__main__':
    # Google Glass optical projection prism at 45 degree tilt
    calculate_reflection_grating(45.0)`
    },
    'jjrobots/B-ROBOT_EVO2': {
      filename: 'stabilizer.ino',
      language: 'cpp',
      code: `// Gyroscopic proportional-integral-derivative control
// Prevents mechanical transporter collapse during sidewalk transits

float Kp = 1.25;
float Ki = 0.05;
float Kd = 0.12;

float lastError = 0.0;
float integral = 0.0;

void setup() {
    Serial.begin(115200);
    initInertialMeasurementUnit();
}

void loop() {
    float currentAngle = readGyroSensorX();
    float targetAngle = 0.0; // Stabilize perpendicular
    
    float error = targetAngle - currentAngle;
    integral += error * 0.012; // Delta timing factor
    float derivative = (error - lastError) / 0.012;
    
    float pidOutputSpeed = (Kp * error) + (Ki * integral) + (Kd * derivative);
    
    // Apply speed vectors to brushless motors
    applyBrushlessMotorPower(pidOutputSpeed);
    
    lastError = error;
    delay(12); // 12ms active frequency loop
}`
    }
  };

  const matched = repositories[repo];

  if (!matched) {
    return res.status(404).json({
      success: false,
      message: `Repository "${repo}" not found in current local mock indexes.`
    });
  }

  res.json({
    success: true,
    repo,
    ...matched
  });
};
