Example: med1.service

Installing:

  cp med1.service /lib/systemd/system/med1.service

Starting/Stopping/Restarting

  systemctl enable med1
  systemctl start med1

Viewing the output: 

  journalctl -u med1 -f

-----------------------------------------------------------

Testing (connected):


Testing (not connected):

  * Process 1: run the bb monitor
  * Process 2: monitor-dashboard

  * Dashboard components for testing
  * 

Steps:
* Get the bb monitor app running
* Connect up to the monitor dashboard

