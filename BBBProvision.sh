#!/bin/bash

# This provisions a BeagleBone Black the way I like it.  
# scp it to the BBB and run as root.

# Set known hosts here
cat << HERE > /etc/hosts
127.0.0.1	localhost.localdomain		localhost

192.168.1.21	ip-camera-1
192.168.1.22	ip-camera-2
192.168.1.22	wellcam
192.168.1.51	bb1
192.168.1.51	bb-boiler
192.168.1.52	bb2
192.168.1.52	bb-garage
192.168.1.53	bb3
192.168.1.53	bb-pantry
192.168.1.54	bb4
192.168.1.54	bb-benchtest
192.168.1.201	hotwall-1
192.168.1.202	hotwall-2
HERE

if test "x$1" == "x"
then
  echo "Syntax: $0 {name}"
  echo
  echo "where {name} is a name in this list:"
  grep 'bb-' /etc/hosts | awk '{print "  "$2}'
  exit 1
fi

# Validate $1
if grep "	$1$" /etc/hosts > /dev/null
then
  true
else
  echo "Not a known host: $1"
  exit 1
fi

echo "Setting the root password"
cd
passwd

# Make a backup directory to put stuff
if test ! -d ./backup
then
    mkdir ./backup
fi

echo "Setting bash as the shell"
sed 's,root:x:0:0:root:/home/root:/bin/sh,root:x:0:0:root:/home/root:/bin/bash,' < /etc/passwd > /tmp/poop && mv /tmp/poop /etc/passwd

echo "Setting up time services"
if test ! -f /etc/ntp.conf
then
    opkg update
    opkg install ntp
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
restrict 192.168.1.0 mask 255.255.255.0 nomodify notrap
TIMESVR

    # Setting timezone
    rm -f /etc/localtime
    ln -s /usr/share/zoneinfo/PST8PDT /etc/localtime

    # Enable time services
    systemctl enable ntpdate.service
    systemctl enable ntpd.service
    systemctl stop ntpd.service
    systemctl stop ntpdate.service
    cat << NTPDATE > /lib/systemd/system/ntpdate.service
[Unit]
Description=Network Time Service (one-shot ntpdate mode)
Before=ntpd.service

[Service]
Type=oneshot
ExecStart=/usr/bin/ntpd -q -g -x
ExecStart=/sbin/hwclock --systohc
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
NTPDATE
    systemctl start ntpdate.service
    systemctl start ntpd.service
    systemctl --system daemon-reload

fi

echo "Resetting crontab"
crontab << HERE
HERE
# @reboot /usr/bin/ntpdate -b -s -u pool.ntp.org
# 30 * * * *  /usr/bin/ntpdate -b -s -u pool.ntp.org

echo "Installing .bash_profile"
cat << THERE > .bash_profile
PATH=\$PATH:.
export NODE_ENV=external
set -o vi
THERE

echo "Installing .vimrc"
cat << EVERYWHERE > .vimrc
:set tabstop=40
:set softtabstop=2
:set shiftwidth=2
:set expandtab
:set nobackup
:set ignorecase
:set number
:set indentexpr=
map [ :e#
map ] :n
map < :set nonumber
map > :set number
EVERYWHERE

# Disable gnome desktop
if test -f /lib/systemd/system/gdm.service
then
    echo "Disabling the Gnome desktop"
    update-rc.d -f gdm remove
    systemctl disable gdm
    mv /lib/systemd/system/gdm.service ~/backup/gdm.service
    systemctl --system daemon-reload
fi

# Disable cloud9 IDE
if test -f /lib/systemd/system/cloud9.service
then
    echo "Disabling the cloud9 IDE"
    systemctl disable cloud9
    mv /lib/systemd/system/cloud9.service ~/backup/cloud9.service
    systemctl disable bonescript-autorun
    mv /lib/systemd/system/bonescript-autorun.service ~/backup/bonescript-autorun.service
    systemctl --system daemon-reload
fi

echo "Setting HOSTNAME to $1"
hostname $1
echo $1 > /etc/hostname

# Manually set the nameserver (DHCP will be disabled)
cd /var/lib/connman
service=`ls -d ethernet*cable`
cd /usr/lib/connman/test
./set-nameservers $service 192.168.1.1 8.8.8.8

# Fix the IP address, and disable DHCP
IP_ADDR=`grep $1 /etc/hosts | awk '{print $1}'`
if ./get-services | grep 'IPv4.*'$IP_ADDR > /dev/null
then
  true
else
  echo "About to set IP address to $IP_ADDR and reboot"
  echo "After reboot, login to root@$1 (or root@$IP_ADDR)"
  echo -n "Press enter to continue: "
  read akey
  echo "Rebooting..."
  ./set-ipv4-method $service manual $IP_ADDR 255.255.255.0 192.168.1.1 > /dev/null
  reboot
fi

echo "Reboot to unload everything"
