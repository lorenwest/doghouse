Notes on an 8 relay module front-ended by a 74HC595 shift register.
See IC74HC595.js for the IC pin layout.
 
IC layout:
PIN 15, 1-7 | Out0-7 | Output pins 0-7
PIN 8       | GND    | Ground (-)
PIN 9       | Out7"  | Chain - Serial out (for chaining to data in)
PIN 10      | MR     | Clear - Master Reclear (active low)
PIN 11      | SH_CP  | Clock - Shift Register Clock Pin
PIN 12      | ST_CP  | Latch - Storage Register Clock Pin
PIN 13      | OE     | Enable - Output Enable (low=enable, high=disable)
PIN 14      | SER    | Data - Serial Data
PIN 16      | VCC    | Supply voltage (+3v3)
 
Assembly notes:
* Tie OE to VCC w/10kOhm resistor to disable solenoids on power-on
* Tie JD-VCC on relay board to +5v
* Tie MR (master reclear) to +VCC.
  

Ethernet from BB to the Relay board

Relay Board     Wire Color     BeagleBone
------------|---------------|-------------
 Ground     | Orange Stripe |   Ground
 Pin 16     | Orange        |   +3.3VDC
 JD-VCC     | Green Stripe  |   +5.0VDC
 Pin 14     | Blue          |   GPIO Data
 Pin 11     | Blue Stripe   |   GPIO Clock
 Pin 12     | Green         |   GPIO Latch
 Pin 13     | Brown Stripe  |   GPIO Enable
 ----       | Brown         |   ----

 
IC Layout

IC                 Notes
-----------------|----------------------------
PIN  1 - Out1    | Relay IN-7
PIN  2 - Out2    | Relay IN-6
PIN  3 - Out3    | Relay IN-5
PIN  4 - Out4    | Relay IN-4
PIN  5 - Out5    | Relay IN-3
PIN  6 - Out6    | Relay IN-2
PIN  7 - Out7    | Relay IN-1
PIN  8 - Ground  | Ground bus - 2 relay GNDs
PIN  9 - SER out | ---
PIN 10 - Clear   | Tied to +VCC
PIN 11 - Clock   | Blue Stripe
PIN 12 - Latch   | Green
PIN 13 - Enable  | Brown Stripe, 10kOhm to VCC
PIN 14 - Data    | Blue
PIN 15 - Out8    | Relay IN-8
PIN 16 - VCC     | VCC Bus - 3.3V
