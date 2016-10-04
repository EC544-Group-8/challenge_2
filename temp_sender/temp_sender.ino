// This code was adopted from https://learn.adafruit.com/thermistor/using-a-thermistor
// And is used on each of the sensors

// which analog pin to connect
#define THERMISTORPIN A0
// resistance at 25 degrees C
#define THERMISTORNOMINAL 10000
// temp. for nominal resistance (almost always 25 C)
#define TEMPERATURENOMINAL 25
// how many samples to take and average, more takes longer
// but is more 'smooth'
#define NUMSAMPLES 5
// The beta coefficient of the thermistor (usually 3000-4000)
#define BCOEFFICIENT 3950
// the value of the 'other' resistor
#define SERIESRESISTOR 9100

#include <SoftwareSerial.h>
#include "string.h"

SoftwareSerial xbeeSerial(2, 3);


#define SEND 's'
#define DEVICE_ID 2
char devices[] = {'x', 'a', 'b', 'c', 'd'};

int samples[NUMSAMPLES];

void setup(void) {
  Serial.begin(9600);
  xbeeSerial.begin(115200);
  analogReference(EXTERNAL);
}
float getTemp();

void loop(void) {
  float temp = getTemp();
  char input = devices[0];
  while(xbeeSerial.available() > 0){
    // get input one character at a time
    input = (char)xbeeSerial.read(); 
    Serial.println(input);
   
    if(input == devices[DEVICE_ID]){
      Serial.println("sending");
      xbeeSerial.print(DEVICE_ID);
      xbeeSerial.print(":");
      xbeeSerial.println(temp);
      input = 'x';
  }
 }
}


float getTemp() {
  uint8_t i;
  float average;

  // take N samples in a row, with a slight delay
  for (i = 0; i < NUMSAMPLES; i++) {
    samples[i] = analogRead(THERMISTORPIN);
    delay(10);
  }

  // average all the samples out
  average = 0;
  for (i = 0; i < NUMSAMPLES; i++) {
    average += samples[i];
  }
  average /= NUMSAMPLES;

  //Serial.print("Average analog reading ");
  //Serial.println(average);

  // convert the value to resistance
  average = 1023 / average - 1;
  average = SERIESRESISTOR / average;
  //Serial.print("Thermistor resistance ");
  //Serial.println(average);

  float steinhart;
  steinhart = average / THERMISTORNOMINAL;     // (R/Ro)
  steinhart = log(steinhart);                  // ln(R/Ro)
  steinhart /= BCOEFFICIENT;                   // 1/B * ln(R/Ro)
  steinhart += 1.0 / (TEMPERATURENOMINAL + 273.15); // + (1/To)
  steinhart = 1.0 / steinhart;                 // Invert
  steinhart -= 273.15;                         // convert to C
  return (steinhart);

}
