#define BUTTON_INPUT 2
#define SHIFT 3
int potPin = A0;
int val = 0;
int left = true;
int buttonState = 0;
int ledPin = 7;

void setup() {
  // Set LED mode to output
  pinMode(ledPin, OUTPUT);
  // Set button interrupts
  attachInterrupt(0, mouse, CHANGE);
  attachInterrupt(1, shift, FALLING);
  // LED starts off
  digitalWrite(ledPin, LOW);
  // Start serial communication
  Serial.begin(9600);
}

void loop() {
  // Turn on the LED if it's on right-click
  if (left == false) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
  // Check the potentiometer value and print it every 100 mili
  val = analogRead(potPin);
  Serial.println(val);
  delay(300);
}

void mouse() {
  buttonState = digitalRead(BUTTON_INPUT);
  // Send the proper click data, depending on the state
  if (left) {
    if (buttonState == 0) {
     Serial.println("left_click");
    } else {
      Serial.println("left_unclick");
    }
  } else {
    if (buttonState == 0) {
      Serial.println("right_click");
    } else {
     Serial.println("right_unclick");
    }
  }
}

void shift() {
  // Make the opposite button active
  left = !left;
}


