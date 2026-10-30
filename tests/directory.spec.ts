import {test,expect} from '@playwright/test';
test('empty public directory is honest and navigable',async({page})=>{
 await page.goto('/opportunities');
 await expect(page.getByRole('heading',{name:'Opportunity directory'})).toBeVisible();
 await expect(page.getByRole('status')).toContainText('0 opportunities');
 await expect(page.getByText('No matching opportunities')).toBeVisible();
 await page.getByLabel('Search opportunities').fill('fictional');
 await expect(page.getByRole('status')).toContainText('0 opportunities');
 await page.getByRole('button',{name:'Clear filters'}).click();
});
test('methodology explains unknown states',async({page})=>{await page.goto('/methodology');await expect(page.getByText('No reliable status evidence',{exact:false})).toBeVisible()});
