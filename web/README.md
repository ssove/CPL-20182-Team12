<<����>>
1.npm init
2.npm install --save fd connect mongodb mongoose socket.io
3.node server



<<�̰� �Ⱦ�>>
1. mongodb�� �ٿ�޴´�
2. ���ϴ� ���丮�� ����� (md data)
3. �� �����ͷ� db�� �������� �����. �н� �������� mongobd ��bin ������ �����
(mongod --dbpath D:\capstone\web_app1\data)

C:\Program Files\MongoDB\Server\4.0\bin



<<events.js:167
      throw er; // Unhandled 'error' event
�� ������ �Ʒ��� ���� ���δ�.>>

������(Window)���� ��� ��Ʈ Ȯ�� �� ���μ��� KILL
1. Ư����Ʈ�� �����ִ��� Ȯ��
- netstat -na | findstr "��Ʈ"

2. ���� �ִ� ��Ʈ�� PID Ȯ��
- netstat -nao | findstr "��Ʈ"

3. PID ã��
- tasklist | findstr "PID��ȣ"

4. ���μ��� ���̱�
- taskkill /f /pid "PID��ȣ"

<<CSS�� ���߿�>>

<<�ٸ� ȣ��Ʈ...�̤�>>