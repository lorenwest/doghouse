#!/bin/bash
HOSTNAME=he-env1
IP_ADDR=192.168.4.20
GATEWAY=192.168.4.254

cat << TIMESVR > /etc/ntp.conf
# This is the most basic ntp configuration file
# The driftfile must remain in a place specific to this
# machine - it records the machine specific clock error
driftfile /etc/ntp.drift
logfile /var/log/ntpd.log

server time-a.timefreq.bldrdoc.gov
server time-b.timefreq.bldrdoc.gov
server time-c.timefreq.bldrdoc.gov
server nist1-lv.ustiming.org

# Using local hardware clock as fallback
# Disable this when using ntpd -q -g -x as ntpdate or it will sync to itself
# server 127.127.1.0
# fudge 127.127.1.0 stratum 14

# Defining a default security setting
restrict 192.168.4.0 mask 255.255.255.0 nomodify notrap
TIMESVR

echo "Setting HOSTNAME to $HOSTNAME"
hostname $HOSTNAME
echo $HOSTNAME > /etc/hostname

# Manually set the nameserver (DHCP will be disabled)
cd /var/lib/connman
service=`ls -d ethernet*cable`
cd /usr/lib/connman/test
./set-nameservers $service $GATEWAY 8.8.8.8

# Fix the IP address, and disable DHCP
if ./get-services | grep 'IPv4.*'$IP_ADDR > /dev/null
then
  true
else
  echo "About to set IP address to $IP_ADDR and reboot"
  echo "After reboot, login to root@$HOSTNAME (or root@$IP_ADDR)"
  echo -n "Press enter to continue: "
  read akey
  echo "Rebooting..."
  ./set-ipv4-method $service manual $IP_ADDR 255.255.255.0 $GATEWAY > /dev/null
  reboot
fi

echo "Reboot to unload everything"
