"""Initial schema migration for ResumeForge

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-08-12 10:15:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 2. Create resumes table
    op.create_table(
        'resumes',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('template', sa.String(length=100), nullable=True, server_default='Classic Corporate'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_resumes_user_id'), 'resumes', ['user_id'], unique=False)

    # 3. Create education table
    op.create_table(
        'education',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('resume_id', sa.String(length=36), nullable=False),
        sa.Column('institution', sa.String(length=255), nullable=False),
        sa.Column('degree', sa.String(length=255), nullable=True),
        sa.Column('field_of_study', sa.String(length=255), nullable=True),
        sa.Column('start_date', sa.String(length=50), nullable=True),
        sa.Column('end_date', sa.String(length=50), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['resume_id'], ['resumes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # 4. Create experience table
    op.create_table(
        'experience',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('resume_id', sa.String(length=36), nullable=False),
        sa.Column('company', sa.String(length=255), nullable=False),
        sa.Column('position', sa.String(length=255), nullable=False),
        sa.Column('location', sa.String(length=255), nullable=True),
        sa.Column('start_date', sa.String(length=50), nullable=True),
        sa.Column('end_date', sa.String(length=50), nullable=True),
        sa.Column('is_current', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('description', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['resume_id'], ['resumes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # 5. Create projects table
    op.create_table(
        'projects',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('resume_id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('role', sa.String(length=255), nullable=True),
        sa.Column('url', sa.String(length=500), nullable=True),
        sa.Column('start_date', sa.String(length=50), nullable=True),
        sa.Column('end_date', sa.String(length=50), nullable=True),
        sa.ForeignKeyConstraint(['resume_id'], ['resumes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # 6. Create skills table
    op.create_table(
        'skills',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('resume_id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('level', sa.String(length=50), nullable=True),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.ForeignKeyConstraint(['resume_id'], ['resumes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # 7. Create certificates table
    op.create_table(
        'certificates',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('resume_id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('issuer', sa.String(length=255), nullable=False),
        sa.Column('issue_date', sa.String(length=50), nullable=True),
        sa.Column('expiry_date', sa.String(length=50), nullable=True),
        sa.Column('url', sa.String(length=500), nullable=True),
        sa.ForeignKeyConstraint(['resume_id'], ['resumes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # 8. Create languages table
    op.create_table(
        'languages',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('resume_id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('proficiency', sa.String(length=100), nullable=True),
        sa.ForeignKeyConstraint(['resume_id'], ['resumes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # 9. Create social_links table
    op.create_table(
        'social_links',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('resume_id', sa.String(length=36), nullable=False),
        sa.Column('platform', sa.String(length=100), nullable=False),
        sa.Column('url', sa.String(length=500), nullable=False),
        sa.ForeignKeyConstraint(['resume_id'], ['resumes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # 10. Create ats_checks table
    op.create_table(
        'ats_checks',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('score', sa.Integer(), nullable=False),
        sa.Column('matched_keywords', sa.Text(), nullable=True),
        sa.Column('missing_keywords', sa.Text(), nullable=True),
        sa.Column('formatting_issues', sa.Text(), nullable=True),
        sa.Column('suggestions', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('ats_checks')
    op.drop_table('social_links')
    op.drop_table('languages')
    op.drop_table('certificates')
    op.drop_table('skills')
    op.drop_table('projects')
    op.drop_table('experience')
    op.drop_table('education')
    op.drop_index(op.f('ix_resumes_user_id'), table_name='resumes')
    op.drop_table('resumes')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
