#include <avr/interrupt.h>
#include <avr/io.h>

#define MOTOR_SPEED 110/2
int motorPin = 10;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  pinMode(motorPin, OUTPUT);

  digitalWrite(motorPin, LOW);
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(motorPin, HIGH);
  delay(1000);
  digitalWrite(motorPin, LOW);
  delay(1000);

}
