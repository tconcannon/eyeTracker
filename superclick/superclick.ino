#define BUTTON_INPUT 2

int buttonState = 0;

void setup() {
  Serial.begin(9600);
  
}

void loop() {
  buttonState = digitalRead(BUTTON_INPUT);
  if (buttonState == 0) {
    Serial.println("mouse");
  }
  

}


