
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  const cnt = await p.subject.count();
  console.log('subject count:', cnt);
  const rows = await p.subject.findMany({ take: 5, select: { subjectId: true, alias: true, status: true, entryRoute: true, registeredAt: true } });
  console.log(JSON.stringify(rows, null, 2));
  const intakeCnt = await p.intake.count();
  console.log('intake count:', intakeCnt);
  const caseCnt = await p.case.count();
  console.log('case count:', caseCnt);
  const testCnt = await p.naMemberTest.count();
  console.log('na_member_test count:', testCnt);
  const progCnt = await p.naProgram.count();
  console.log('na_program count:', progCnt);
  const refCnt = await p.naMemberReferral.count();
  console.log('na_member_referral count:', refCnt);
}
main().catch(console.error).finally(() => p.$disconnect());
