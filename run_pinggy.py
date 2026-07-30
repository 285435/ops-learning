#!/usr/bin/env python3
"""用 pty 模拟终端启动 pinggy SSH 隧道，捕获公网 URL 并保持隧道运行。"""
import pty, os, sys, time, select, re, signal

LOG = "/tmp/pinggy.log"
URL_FILE = "/workspace/pinggy_url.txt"

os.system("pkill -f 'ssh.*pinggy' 2>/dev/null")
time.sleep(1)

master, slave = pty.openpty()
pid = os.fork()
if pid == 0:
    os.setsid()
    os.dup2(slave, 0)
    os.dup2(slave, 1)
    os.dup2(slave, 2)
    os.environ["TERM"] = "xterm-256color"
    os.execvp("ssh", [
        "ssh",
        "-o", "ProxyCommand=nc -X connect -x 127.0.0.1:18080 %h %p",
        "-o", "StrictHostKeyChecking=no",
        "-o", "ServerAliveInterval=30",
        "-p", "443",
        "-R0:localhost:8000",
        "a.pinggy.io",
    ])
    os._exit(1)

os.close(slave)
output = b""
url_found = False
start = time.time()
log_f = open(LOG, "wb")

def forward_sig(signum, frame):
    try:
        os.kill(pid, signum)
    except Exception:
        pass
signal.signal(signal.SIGTERM, forward_sig)
signal.signal(signal.SIGINT, forward_sig)

sys.stdout.write("pinggy started (ssh pid=%d)\n" % pid)
sys.stdout.flush()

while True:
    try:
        r, _, _ = select.select([master], [], [], 1)
    except (OSError, select.error):
        break
    if r:
        try:
            data = os.read(master, 4096)
            if not data:
                break
            output += data
            log_f.write(data)
            log_f.flush()
            text = output.decode(errors='replace')
            urls = re.findall(r'https?://[a-zA-Z0-9.-]+\.pinggy\.us[a-zA-Z0-9/]*', text)
            if urls and not url_found:
                url_found = True
                with open(URL_FILE, "w") as f:
                    f.write(urls[0] + "\n")
                sys.stdout.write("\n=== URL: %s ===\n" % urls[0])
                sys.stdout.flush()
        except OSError:
            break
    try:
        wpid, _ = os.waitpid(pid, os.WNOHANG)
        if wpid != 0:
            sys.stdout.write("ssh exited\n")
            break
    except ChildProcessError:
        break
    if time.time() - start > 3600:
        break

log_f.close()
try:
    os.close(master)
except Exception:
    pass
