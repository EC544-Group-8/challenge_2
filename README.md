# Challenge 1 - Building a Nest

### Goal
Create a system that will continuously measure (0.5 Hz) temperature in five locations in the room, compute the instantaneous average temperature and report these values to a central station in calibrated engineering units.

### Required Elements

- [X] Measures temperature at each device
- [X] Sends data to base 
- [X] Computes average
- [X] Different program at base vs at wireless device
- [X] Engineering units displayed

### Qualitative Elements

- [ ] Bonus features

    - [ ] temperature warnings if too hot/cold
- [ ] Evidence of scalability to 1000s of devices

    - [ ] use dynamic data structure for list of devices on network
    - [ ] methods to add/drop as mentioned below
    
- [ ] Robustness to added or dropped devices

	- [ ] function to add device
	- [ ] function to drop device
	- [ ] function to automatically drop device if timeout in communications
- [ ] Demonstrated effort to calibrate sensors

	- [ ] Ice water, boiling water, and room temp test (wrap thermistors in something waterproof)
